import { FaCheck } from "react-icons/fa";

const BooleanPill = ({ label, checked, onChange }) => {
  return (
    <div className={`boolean-pill ${checked ? "checked" : "unchecked"}`} onClick={() => onChange(!checked)} role="button">
      <span>{label}</span>
      <span className="circle">{checked && <FaCheck size={12} />}</span>
    </div>
  );
};

export default BooleanPill;
