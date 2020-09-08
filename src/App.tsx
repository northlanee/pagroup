import React, { FC, ReactElement } from "react";

import { Dropdown } from "./components";

import "./App.css";

const elements = [
  "Element 1",
  "Element 2",
  "Element 3",
  "Element 4",
  "Element 5",
  "Element 6",
  "Element 7",
];

const App: FC = (): ReactElement => {
  const [selectedElements, setSelectedElements] = React.useState<string[]>([]);

  const changeElementsHandler = (elements: string[]) => {
    setSelectedElements(elements);
  };

  const selectedElementsJSX =
    selectedElements.length === 0 ? (
      <div className="noElements">No selected elements</div>
    ) : (
      selectedElements.map((el) => (
        <div className="list-element" key={el}>
          {el}
        </div>
      ))
    );

  return (
    <div className="app">
      <div className="container">
        <h2>Dropdown:</h2>
        <Dropdown
          elements={elements}
          defaultText="Default text"
          dropdownHandler={changeElementsHandler}
        />
      </div>
      <div className="elements">
        <h2>Selected Elements:</h2>
        {selectedElementsJSX}
      </div>
    </div>
  );
};

export default App;
