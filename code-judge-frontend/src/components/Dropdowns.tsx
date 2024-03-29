type DropdownOptions = {[optionName: string]: () => void}

interface DropdownsProps {
  header: string;
  options: DropdownOptions; // options is a Map which contains optionName as key, callback function as value
}

const Dropdowns = ({ header, options }: DropdownsProps) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle rounded-pill"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {header}
      </button>
      <ul className="dropdown-menu">
        {Object.entries(options).map(
          ([optionName, callback]: [string, () => void]) => (
            <li key={optionName}>
              <button className="dropdown-item" onClick={callback}>
                {optionName}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Dropdowns;
