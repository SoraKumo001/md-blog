import { scalarType } from 'nexus';

export const Upload = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload',
  sourceType: {
    module: '@react-libraries/next-apollo-server',
    export: 'FormidableFile',
  },
});
