import { Block } from './document';

export type { Block };

export interface BlockWithChildren extends Block {
  children?: BlockWithChildren[];
}
