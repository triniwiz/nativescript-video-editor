import { Observable } from 'tns-core-modules/data/observable';
export class HelloWorldModel extends Observable {
  progress = 0;
  constructor() {
    super();
  }
}
