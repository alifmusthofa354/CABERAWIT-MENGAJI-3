import { create } from "zustand";

type Store = {
  selectedClassName: string;
  updateSelectedClassName: (newClassName: string) => void;
};

const useStore = create<Store>((set) => ({
  selectedClassName: "",
  updateSelectedClassName: (newClassName) =>
    set({ selectedClassName: newClassName }),
}));

export default useStore;
