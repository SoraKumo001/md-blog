import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  BigInt: { input: any; output: any; }
  /** The `Byte` scalar type represents byte value as a Buffer */
  Bytes: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  Posts: Array<Post>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FireStore = {
  __typename?: 'FireStore';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postCards: Array<Post>;
  posts: Array<Post>;
  systemCards: Array<System>;
  systemIcons: Array<System>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  Category: Category;
  Post?: Maybe<Post>;
  PostFile: FireStore;
  SignIn?: Maybe<User>;
  System: System;
};


export type MutationCategoryArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationPostArgs = {
  card?: InputMaybe<Scalars['Upload']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isTrash?: InputMaybe<Scalars['Boolean']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPostFileArgs = {
  binary: Scalars['Upload']['input'];
  postId: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSystemArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['Upload']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  authorId: Scalars['String']['output'];
  card?: Maybe<FireStore>;
  cardId?: Maybe<Scalars['String']['output']>;
  categories: Array<Category>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  postFiles: Array<FireStore>;
  published: Scalars['Boolean']['output'];
  publishedAt: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  Categories: Array<Category>;
  Category: Category;
  Post: Post;
  Posts: Array<Post>;
  System: System;
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryPostArgs = {
  id: Scalars['String']['input'];
};

export type System = {
  __typename?: 'System';
  card?: Maybe<FireStore>;
  cardId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  icon?: Maybe<FireStore>;
  iconId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type User = {
  __typename?: 'User';
  Post: Array<Post>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SignInMutationVariables = Exact<{
  token?: InputMaybe<Scalars['String']['input']>;
}>;


export type SignInMutation = { __typename?: 'Mutation', SignIn?: { __typename?: 'User', id: string, email: string, createdAt: string, updatedAt: string, name: string } | null };

export type PostQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type PostQuery = { __typename?: 'Query', Post: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId: string, cardId?: string | null, createdAt: string, updatedAt: string, publishedAt: string, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', Posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, authorId: string, cardId?: string | null, createdAt: string, updatedAt: string, publishedAt: string, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> }> };

export type UpdatePostMutationVariables = Exact<{
  postId?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  isTrash?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  card?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', Post?: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId: string, createdAt: string, updatedAt: string, publishedAt: string, cardId?: string | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> } | null };

export type UploadPostFileMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  binary: Scalars['Upload']['input'];
}>;


export type UploadPostFileMutation = { __typename?: 'Mutation', PostFile: { __typename?: 'FireStore', id: string, createdAt: string, updatedAt: string, name: string, mimeType: string } };

export type SystemQueryVariables = Exact<{ [key: string]: never; }>;


export type SystemQuery = { __typename?: 'Query', System: { __typename?: 'System', id: string, title: string, description: string, iconId?: string | null, cardId?: string | null, createdAt: string, updatedAt: string, icon?: { __typename?: 'FireStore', id: string, name: string, mimeType: string, createdAt: string, updatedAt: string } | null } };

export type UpdateSystemMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateSystemMutation = { __typename?: 'Mutation', System: { __typename?: 'System', id: string, title: string, description: string, iconId?: string | null, cardId?: string | null, createdAt: string, updatedAt: string, icon?: { __typename?: 'FireStore', id: string, name: string, mimeType: string, createdAt: string, updatedAt: string } | null } };

export type CategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CategoryQuery = { __typename?: 'Query', Category: { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', Categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> };

export type UpdateCategoryMutationVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', Category: { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string } };


export const SignInDocument = gql`
    mutation SignIn($token: String) {
  SignIn(token: $token) {
    id
    email
    createdAt
    updatedAt
    name
  }
}
    `;

export function useSignInMutation() {
  return Urql.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);
};
export const PostDocument = gql`
    query Post($postId: String!) {
  Post(id: $postId) {
    id
    published
    title
    content
    authorId
    cardId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'>) {
  return Urql.useQuery<PostQuery, PostQueryVariables>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  Posts {
    id
    published
    title
    authorId
    cardId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

export function usePostsQuery(options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery, PostsQueryVariables>({ query: PostsDocument, ...options });
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($postId: String, $title: String, $content: String, $published: Boolean, $isTrash: Boolean, $publishedAt: DateTime, $categories: [String!], $card: Upload) {
  Post(
    id: $postId
    title: $title
    content: $content
    published: $published
    isTrash: $isTrash
    publishedAt: $publishedAt
    categories: $categories
    card: $card
  ) {
    id
    published
    title
    content
    authorId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
    cardId
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const UploadPostFileDocument = gql`
    mutation UploadPostFile($postId: String!, $binary: Upload!) {
  PostFile(postId: $postId, binary: $binary) {
    id
    createdAt
    updatedAt
    name
    mimeType
  }
}
    `;

export function useUploadPostFileMutation() {
  return Urql.useMutation<UploadPostFileMutation, UploadPostFileMutationVariables>(UploadPostFileDocument);
};
export const SystemDocument = gql`
    query System {
  System {
    id
    title
    description
    iconId
    cardId
    createdAt
    updatedAt
    icon {
      id
      name
      mimeType
      createdAt
      updatedAt
    }
  }
}
    `;

export function useSystemQuery(options?: Omit<Urql.UseQueryArgs<SystemQueryVariables>, 'query'>) {
  return Urql.useQuery<SystemQuery, SystemQueryVariables>({ query: SystemDocument, ...options });
};
export const UpdateSystemDocument = gql`
    mutation UpdateSystem($title: String, $description: String, $icon: Upload) {
  System(title: $title, description: $description, icon: $icon) {
    id
    title
    description
    iconId
    cardId
    createdAt
    updatedAt
    icon {
      id
      name
      mimeType
      createdAt
      updatedAt
    }
  }
}
    `;

export function useUpdateSystemMutation() {
  return Urql.useMutation<UpdateSystemMutation, UpdateSystemMutationVariables>(UpdateSystemDocument);
};
export const CategoryDocument = gql`
    query Category($id: String!) {
  Category(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useCategoryQuery(options: Omit<Urql.UseQueryArgs<CategoryQueryVariables>, 'query'>) {
  return Urql.useQuery<CategoryQuery, CategoryQueryVariables>({ query: CategoryDocument, ...options });
};
export const CategoriesDocument = gql`
    query Categories {
  Categories {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useCategoriesQuery(options?: Omit<Urql.UseQueryArgs<CategoriesQueryVariables>, 'query'>) {
  return Urql.useQuery<CategoriesQuery, CategoriesQueryVariables>({ query: CategoriesDocument, ...options });
};
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: String, $name: String!) {
  Category(id: $id, name: $name) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateCategoryMutation() {
  return Urql.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument);
};