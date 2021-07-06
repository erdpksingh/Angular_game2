export class Content {
  categories: Category[];
}

export class Category {
  entry_prefix: string;
  values: KeyValuePair[] = [];
  entries: Entry[] = [];
  add_and_remove: boolean;

  constructor(entry_prefix = null, add_and_remove = false) {
    this.entry_prefix = entry_prefix;
    this.add_and_remove = add_and_remove;
  }

  getEntry(id: number): Entry {

    for (const entry of this.entries) {
      if (entry.id === id) {
        return entry;
      }
    }

    const newEntry = {id, prefix: this.entry_prefix + id.toString(), values: []};
    this.entries.push(newEntry);

    return newEntry;
  }

  removeEntry(entry: Entry): void {
    const index = this.entries.indexOf(entry);
    if (index > -1) {
      this.entries.splice(index, 1);
    }
  }

  updateEntryKeys(): void {
    for (let i = 0; i < this.entries.length; i++) {
      for (let value of this.entries[i].values) {
        value.key = this.entry_prefix + i + '_' + value.key_partial;
      }
    }
  }
}

export class KeyValuePair {
  key: string;
  key_partial?: string;
  value: string;
  base_value?: string;
  reference_value?: string;
  category: string;
  style?: string;
  label?: string;
  sort_id?: number;
  hierarchy_indices?: object;
}

export class Entry {
  id: number;
  prefix: string;
  values: KeyValuePair[];
}
