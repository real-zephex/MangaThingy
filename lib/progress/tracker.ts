"use client";

export type Progress = {
  id: string;
  title: string;
  image: string;
  status: string;
  chapter?: string;
  chapterId?: string;
  chapterTitle?: string;
  provider?: string;
  totalChapter?: string;
  rating?: number;
  updatedAt?: number;
};

export class ProgressTracker {
  private getLocalStorage(): Progress[] {
    if (typeof window === "undefined") return [];
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
  setLocalStorage(data: Progress[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("progress", JSON.stringify(data));
  }

  // removes progress based on ID and optional provider
  remove(id: string, provider?: string): Progress[] {
    const current = this.getLocalStorage();
    const updated = current.filter((p) => {
      if (provider) {
        return !(p.id === id && p.provider === provider);
      }
      return p.id !== id;
    });
    this.setLocalStorage(updated);
    return updated;
  }

  // updates the progress
  update(updatedItem: Progress): Progress[] {
    const current = this.getLocalStorage();
    const updated = current.map((p) => {
      if (updatedItem.provider) {
        return p.id === updatedItem.id && p.provider === updatedItem.provider
          ? { ...updatedItem, updatedAt: Date.now() }
          : p;
      }
      return p.id === updatedItem.id
        ? { ...updatedItem, updatedAt: Date.now() }
        : p;
    });
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
    const updated = [
      ...current,
      { ...data, updatedAt: data.updatedAt ?? Date.now() },
    ];
    this.setLocalStorage(updated);
    return updated;
  }

  // returns a single item, can be used to check their existence
  getOne(id: string, provider?: string): Progress | undefined {
    const current = this.getLocalStorage();
    if (provider) {
      return current.find((p) => p.id === id && p.provider === provider);
    }
    return current.find((p) => p.id === id);
  }
}
