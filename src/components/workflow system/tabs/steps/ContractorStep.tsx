const ContractorStep = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label
          htmlFor="bpNumber"
          className="mb-2 block text-sm font-medium text-[#6E6D6D]"
        >
          BP Number
        </label>
        <input
          type="text"
          id="bpNumber"
          name="bpNumber"
          className="w-full border border-[#ECE9E9] p-2 text-sm text-[#1C1C1C] sm:w-[80%]"
          value={formData.bpNumber}
          onChange={(e) =>
            setFormData({ ...formData, bpNumber: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="paidBy"
          className="mb-2 block text-sm font-medium text-[#6E6D6D]"
        >
          Paid By
        </label>
        <input
          type="text"
          id="paidBy"
          name="paidBy"
          className="w-full border border-[#ECE9E9] p-2 text-sm text-[#1C1C1C] sm:w-[80%]"
          value={formData.paidBy}
          onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
        />
      </div>
      <div className="flex justify-between items-center gap-3 mt-3  sm:w-[80%] w-full">
        <label
          htmlFor="paymentMethod"
          className="mb-2 block text-sm font-medium text-[#6E6D6D]"
        >
          Payment Method
        </label>
        <div className="mt-1 flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="monthly"
              checked={formData.paymentMethod === 'monthly'}
              // onChange={() => setFormData({ ...formData, paymentMethod: 'monthly' })}
              className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
            />
            <span>Monthly</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="yearly"
              checked={formData.paymentMethod === 'yearly'}
              // onChange={() => setFormData({ ...formData, paymentMethod: 'yearly' })}
              className="h-5 w-5 border border-[#e5e5e5] accent-[#B2282F]"
            />
            <span>Yearly</span>
          </label>
        </div>
      </div>

      <div className="bg-gray-50 border-gray-200 mt-3 rounded-lg border p-4 sm:w-[80%] w-full">
        <h4 className="text-gray-700 mb-3 text-base font-semibold">
          Price Breakdown
        </h4>

        {formData.paymentMethod === 'monthly' ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Charge:</span>
              <span className="font-medium">AED 500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (5%):</span>
              <span className="font-medium">AED 25</span>
            </div>
            <div className="border-gray-200 mt-2 flex justify-between border-t pt-2">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-gray-900 font-bold">AED 525</span>
            </div>
          </div>
        ) : formData.paymentMethod === 'yearly' ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Charge:</span>
              <span className="font-medium">AED 5000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (5%):</span>
              <span className="font-medium">AED 250</span>
            </div>
            <div className="border-gray-200 mt-2 flex justify-between border-t pt-2">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-gray-900 font-bold">AED 5250</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-md p-3 text-center">
            <p className="text-gray-500 text-sm">
              Please select a payment method to view the price breakdown
            </p>
          </div>
        )}
      </div>
    </>
  );
};
export default ContractorStep;
