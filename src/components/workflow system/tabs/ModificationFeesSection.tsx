import React, { useEffect } from 'react';

interface FeesData {
  layoutChangeFee: string;
  securityDeposit: string;
  unregisteredContractorFee: string;
  areaChangeSqft: string;
  areaChangeTotal: number;
  total: number;
}

interface Props {
  feesData: FeesData;
  setFeesData: (data: FeesData) => void;
}

const MODIFICATION_FEE = 525;

const ModificationFeesSection: React.FC<Props> = ({ feesData, setFeesData }) => {
  // Calculate area change total and overall total
  useEffect(() => {
    const areaChangeTotal = (parseFloat(feesData.areaChangeSqft) || 0) * 450;
    const total =
      MODIFICATION_FEE +
      (parseFloat(feesData.layoutChangeFee) || 0) +
      (parseFloat(feesData.securityDeposit) || 0) +
      (parseFloat(feesData.unregisteredContractorFee) || 0) +
      areaChangeTotal;
    setFeesData({ ...feesData, areaChangeTotal, total });
    // eslint-disable-next-line
  }, [feesData.layoutChangeFee, feesData.securityDeposit, feesData.unregisteredContractorFee, feesData.areaChangeSqft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeesData({ ...feesData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
          Modification Fee (AED)
        </label>
        <input
          type="text"
          name="modificationFee"
          className="w-full border border-[#ECE9E9] p-2 font-medium text-[#A0A0A0] bg-gray-100 sm:w-[80%] cursor-not-allowed"
          value={MODIFICATION_FEE.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          disabled
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
          Layout Change Fee (AED)<span className="text-red">*</span>
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="layoutChangeFee"
          className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
          value={feesData.layoutChangeFee}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
          Security  Deposit(AED)<span className="text-red">*</span>
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="securityDeposit"
          className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
          value={feesData.securityDeposit}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
          Unregistered Contractor Fee (AED)<span className="text-red">*</span>
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="unregisteredContractorFee"
          className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]"
          value={feesData.unregisteredContractorFee}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <label className="w-full text-[#6E6D6D] sm:w-[20%]">
          Area Change (in sq ft)
        </label>
        <div className="flex w-full items-center gap-2 sm:w-[80%]">
          <input
            type="text"
            inputMode="decimal"
            name="areaChangeSqft"
            className="border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] w-1/2"
            value={feesData.areaChangeSqft}
            onChange={handleChange}
            placeholder="0"
          />
          <span className="text-sm">x 450 =</span>
          <span className="border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] bg-gray-50 w-1/3">
            {feesData.areaChangeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between font-semibold">
        <span className="w-full text-[#6E6D6D] sm:w-[20%]">Total (AED)</span>
        <span className="w-full border border-[#ECE9E9] p-2 font-medium text-[#1C1C1C] sm:w-[80%]">
          {feesData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
        </span>
      </div>
    </div>
  );
};

export type { FeesData };
export default ModificationFeesSection; 