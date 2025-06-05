import { create } from "zustand";

type Store = {
  selectedClassName: string | null;
  updateSelectedClassName: (newClassName: string | null) => void;
};

const useStore = create<Store>((set) => ({
  selectedClassName: null,
  updateSelectedClassName: (newClassName) =>
    set({ selectedClassName: newClassName }),
}));

export default useStore;
