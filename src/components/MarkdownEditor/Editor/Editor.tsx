import { OnMount, Editor as MonacoEditor, useMonaco } from '@monaco-editor/react';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import React, { DOMAttributes, FC, useEffect, useRef, useState, useTransition } from 'react';
import {
  usePostQuery,
  useUpdatePostMutation,
  useUploadPostFileMutation,
} from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { useMarkdown } from '@/hooks/useMarkdown';
import { convertWebp, getImageSize } from '@/libs/webp';
import styled from './Editor.module.scss';
import { Separator } from '../../Commons/Separator';
import { ContentMarkdown } from '../../ContentMarkdown';
import { ToolBar } from '../ToolBar';
import type { editor } from 'monaco-editor';

interface Props {
  id: string;
}

/**
 * Editor
 *
 * @param {Props} { }
 */
export const Editor: FC<Props> = ({ id }) => {
  const [currentTop, setCurrentTop] = useState(0);
  const [{ fetching: uploadFeting }, uploadFile] = useUploadPostFileMutation();
  const monaco = useMonaco();
  const refEditor = useRef<editor.IStandaloneCodeEditor>();
  const refMarkdown = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(1);

  const handleEditorDidMount: OnMount = (editor) => {
    refEditor.current = editor;
    editor.onDidChangeCursorPosition((event) => {
      const currentLine = event.position.lineNumber;
      setCurrentLine(currentLine);
      const top = editor.getScrollTop();
      const linePos = editor.getTopForLineNumber(currentLine);
      const node = refMarkdown.current;
      if (currentLine && node) {
        const nodes = node.querySelectorAll<HTMLElement>('[data-sourcepos]');
        const target = Array.from(nodes).find((node) => {
          const nodeLine = node.dataset.sourcepos?.match(/(\d+)/)?.[1];
          if (!nodeLine) return false;
          return currentLine === Number(nodeLine);
        });
        if (target) {
          const { top: targetTop } = target.getBoundingClientRect();
          const { top: nodeTop } = node.getBoundingClientRect();
          node.scrollTop = targetTop - nodeTop + node.scrollTop - (linePos - top);
        }
      }
    });
  };
  const handleUpload = (file: Blob) => {
    const editor = refEditor.current;
    const p = editor?.getPosition();
    if (editor && monaco && p) {
      convertWebp(file).then((value) => {
        if (!value) throw 'convert error';
        uploadFile({ postId: id, binary: value }).then(async (v) => {
          const size = await getImageSize(value);
          editor.executeEdits('', [
            {
              range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
              text: `![{"width":"${size.width}px","height":"${size.height}px"}](${v.data?.PostFile.id})`,
            },
          ]);
        });
      });
    }
  };
  const handleDrop: DOMAttributes<HTMLDivElement>['onDropCapture'] = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const editor = refEditor.current;
    if (editor && monaco) {
      const p = editor.getTargetAtClientPoint(event.clientX, event.clientY)?.position;
      if (p) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          convertWebp(file).then((value) => {
            if (!value) throw 'convert error';
            uploadFile({ postId: id, binary: value }).then(async (v) => {
              const size = await getImageSize(value);
              editor.executeEdits('', [
                {
                  range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
                  text: `![{"width":"${size.width}px","height":"${size.height}px"}](${v.data?.PostFile.id})`,
                },
              ]);
            });
          });
        }
      }
    }
  };

  const handleDragOver: DOMAttributes<HTMLDivElement>['onDragOver'] = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setTimeout(() => {
      const node = refMarkdown.current;
      if (currentLine && node) {
        const nodes = node.querySelectorAll<HTMLElement>('[data-sourcepos]');
        const target = Array.from(nodes).find((node) => {
          const v = node.dataset.sourcepos?.match(/(\d+)/);
          const nodeLine = v?.[1];
          if (!nodeLine) return false;
          return currentLine === Number(nodeLine);
        });
        if (target) {
          const targetRect = target.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();
          setCurrentTop(targetRect.top - nodeRect.top + node.scrollTop);
        }
      }
    }, 1);
  }, [currentLine]);

  const handleSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const categories = form['categories'].value.split(',');
    const title = form['postTitle'].value;
    const published = form['published'].checked;
    const publishedDate = new Date(form['publishedDate'].value).toISOString();
    updatePost({ postId: id, title, content, published, categories, publishedDate });
  };

  const [{ fetching, data }] = usePostQuery({ variables: { postId: id } });
  const [{ fetching: updateFetching }, updatePost] = useUpdatePostMutation();
  const [content, setContent] = useState<string>();
  const [, update] = useTransition();
  const post = data?.Post;
  useLoading([fetching, updateFetching, uploadFeting]);
  const [children] = useMarkdown(content ?? data?.Post.content);
  if (fetching || !post) return null;
  return (
    <form className={styled.root} onSubmit={handleSubmit}>
      <ToolBar post={post} />
      <div className={styled.body}>
        <Separator>
          <div
            className="h-full"
            onDropCapture={handleDrop}
            onDragOver={handleDragOver}
            onPasteCapture={(e) => {
              Array.from(e.clipboardData.files).forEach((item) => {
                if (item.type.startsWith('image/')) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpload(item);
                }
              });
            }}
          >
            <MonacoEditor
              language="markdown"
              defaultValue={data.Post.content}
              onChange={(e) => update(() => setContent(e ?? ''))}
              onMount={handleEditorDidMount}
              options={{
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                minimap: { enabled: false },
                dragAndDrop: true,
                dropIntoEditor: { enabled: true },
                contextmenu: false,
                occurrencesHighlight: false,
              }}
            />
          </div>
          <div ref={refMarkdown} className="relative h-full overflow-y-auto px-4">
            {currentLine && (
              <ModeStandbyIcon
                className="absolute text-red-400"
                style={{ top: `${currentTop}px` }}
              />
            )}
            <ContentMarkdown
              onClick={(line, offset) => {
                const editor = refEditor.current;
                const node = refMarkdown.current;
                if (editor && node) {
                  const linePos = editor.getTopForLineNumber(line);
                  editor.setScrollTop(linePos - offset + node.scrollTop);
                  editor.setPosition({ lineNumber: line, column: 1 });
                }
              }}
            >
              {children}
            </ContentMarkdown>
          </div>
        </Separator>
      </div>
    </form>
  );
};
