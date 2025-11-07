import { ToastManager } from '@kong/kongponents'

let toaster: ToastManager

export const useToasterManager = () => {
  if(!toaster) {
    toaster = new ToastManager()
  }

  return { toaster }
}
