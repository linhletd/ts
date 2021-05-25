export default class HistoryManager {
  constructor() {
    this.size = 50;
    this.length = 1;
    this.current = 0;
    this.data = [{ text: '', start: 0, end: 0 }];
  }
  reset() {
    this.data = [{ text: '', start: 0, end: 0 }];
  }
  createNewRecord(text, start, end) {
    if (this.current === this.length - 1) {
      if (this.length === this.size) {
        this.data.splice(0, 1);
      } else {
        this.length++;
        this.current++;
      }
    } else {
      this.data.splice(this.current + 1, this.length);
      this.current++;
      this.length = this.current + 1;
    }
    this.data.push({ text, start, end });
  }
  undo() {
    if (this.current !== 0) {
      this.current--;
      return this.data[this.current];
    }
  }
  redo() {
    if (this.current !== this.length - 1) {
      this.current++;
      return this.data[this.current];
    }
  }
}
