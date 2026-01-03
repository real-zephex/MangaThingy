type Progress = {
  id: string;
  title: string;
  image: string;
  status: string;
  chapter?: string;
  provider?: string;
  totalChapter?: string;
};

export class ProgressTracker {
  private getLocalStorage(): Progress[] {
    const store = localStorage.getItem("progress");
    if (!store) return [];
    try {
      const parsed = JSON.parse(store);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn("[ProgressTracker] Failed to parse localStorage entry");
      return [];
    }
  }

  // sets the entire array to local storage
  private setLocalStorage(data: Progress[]): void {
    localStorage.setItem("progress", JSON.stringify(data));
  }

  // removes progress based on ID
  remove(id: string): Progress[] {
    const current = this.getLocalStorage();
    const updated = current.filter((p) => p.id !== id);
    this.setLocalStorage(updated);
    return updated;
  }

  // updates the progress
  update(updatedItem: Progress): Progress[] {
    const current = this.getLocalStorage();
    const updated = current.map((p) =>
      p.id === updatedItem.id ? updatedItem : p,
    );
    this.setLocalStorage(updated);
    return updated;
  }

  // returns all the items from the local storage
  getAll(): Progress[] {
    return this.getLocalStorage();
  }

  // adds a single item to the array in the local storage
  addSingle(data: Progress): Progress[] {
    const current = this.getLocalStorage();
    const updated = [...current, data];
    this.setLocalStorage(updated);
    return updated;
  }

  // returns a single item, can be used to check their existence
  getOne(id: string): Progress | undefined {
    const current = this.getLocalStorage();
    return current.find((p) => p.id === id);
  }
}
