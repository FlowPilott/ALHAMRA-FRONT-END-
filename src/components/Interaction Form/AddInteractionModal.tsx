import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import  React from "react" // Added import for React
import Spinner from "../../common/Spinner"

interface AddInteractionModalProps {
  isOpen: boolean
  onClose: () => void
  newInteraction: string
  setNewInteraction: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

const AddInteractionModal: React.FC<AddInteractionModalProps> = ({
  isOpen,
  onClose,
  newInteraction,
  setNewInteraction,
  onSubmit,
  loading,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="flex min-h-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-xl font-semibold mb-4 text-[#b2282f]">Add New Interaction</Dialog.Title>
              <input
                type="text"
                value={newInteraction}
                onChange={(e) => setNewInteraction(e.target.value)}
                className="w-full border-2 border-[#b2282f]/20 px-3 py-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#b2282f]/50"
                placeholder="Enter new interaction"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-[#b2282f] border-2 border-[#b2282f] rounded-md hover:bg-[#b2282f]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-[#b2282f] text-white rounded-md hover:bg-[#b2282f]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? <Spinner color="white" /> : "Add Interaction"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AddInteractionModal

