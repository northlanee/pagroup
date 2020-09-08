import React, { FC, ReactElement } from "react";
import cn from "classnames";

import "./Dropdown.styles.scss";

type PropTypes = {
  elements: string[];
  defaultText: string;
  dropdownHandler: (elements: string[]) => void;
};

type ListElement = {
  id: number;
  item: string;
  selected: boolean;
};

const Dropdown: FC<PropTypes> = ({
  elements,
  defaultText,
  dropdownHandler,
}: PropTypes): ReactElement => {
  const [isOpened, setIsOpened] = React.useState<boolean>(false);
  const [listItems, _setListItems] = React.useState<ListElement[]>(
    elements.map((item, index) => ({ id: index, item, selected: false }))
  );
  const [selectedMenuItem, _setSelectedMenuItem] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    document.body.addEventListener("keydown", keyboardHandler);
    return () => document.body.removeEventListener("keydown", keyboardHandler);
  }, []);

  const selectedMenuItemRef = React.useRef(selectedMenuItem);
  const listItemsRef = React.useRef(listItems);

  const setSelectedMenuItem = (id: number) => {
    selectedMenuItemRef.current = id;
    _setSelectedMenuItem(id);
  };

  const setListItems = (items: ListElement[]) => {
    listItemsRef.current = items;
    _setListItems(items);
  };

  const getNearestUnselectedElementId = (direction: "up" | "down") => {
    let step = 0;
    if (direction === "up") step = -1;
    if (direction === "down") step = 1;
    const unselectedItems = listItemsRef.current.filter((el) => {
      return !el.selected;
    });
    const currentItemIndex = unselectedItems.findIndex(
      (el) => el.id === selectedMenuItemRef.current
    );
    return unselectedItems[currentItemIndex + step].id;
  };

  const keyboardHandler = (e: KeyboardEvent) => {
    if (e.code === "Escape") setIsOpened(false);

    if (e.code === "ArrowDown") {
      if (selectedMenuItemRef.current === null) {
        setSelectedMenuItem(0);
      } else if (selectedMenuItemRef.current < listItems.length - 1) {
        setSelectedMenuItem(getNearestUnselectedElementId("down"));
      }
    }

    if (e.code === "ArrowUp") {
      if (selectedMenuItemRef.current === null) {
        setSelectedMenuItem(listItems.length - 1);
      } else if (selectedMenuItemRef.current > 0) {
        setSelectedMenuItem(getNearestUnselectedElementId("up"));
      }
    }
  };

  const changeItemSelecting = (selected: boolean, currentId: number) => {
    const listItemsCopy = listItems.map((el) => {
      if (el.id === currentId) return { ...el, selected };
      else return el;
    });
    setListItems(listItemsCopy);
    dropdownHandler(
      listItemsCopy.filter((el) => el.selected).map((el) => el.item)
    );
  };

  const selectElementHandler = () => {
    if (selectedMenuItem !== null) {
      changeItemSelecting(true, selectedMenuItem);
      setSelectedMenuItem(selectedMenuItem + 1);
    }
  };

  const unSelectElementHandler = (id: number) => {
    changeItemSelecting(false, id);
  };

  const onMouseOverSelect = (id: number) => {
    setSelectedMenuItem(id);
  };

  const stopPropagation = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
  };

  const toggleDropdownHandler = () => {
    setIsOpened(!isOpened);
  };

  const dropdownElementsJSX = listItems
    .filter((el) => !el.selected)
    .map(
      (el, index): ReactElement => {
        return (
          <div
            key={`${el.item}_${index}`}
            onClick={selectElementHandler}
            onMouseOver={() => onMouseOverSelect(el.id)}
            className={cn("menu-element", {
              selected: el.id === selectedMenuItem,
            })}
          >
            {el.item}
          </div>
        );
      }
    );

  const selectedElementsJSX = listItems
    .filter((el) => el.selected)
    .map((el, index) => {
      return (
        <li
          className="selectedItem"
          key={`${el.item}_${index}`}
          onClick={stopPropagation}
        >
          <div>{el.item}</div>
          <div
            className="remove"
            onClick={() => unSelectElementHandler(el.id)}
          ></div>
        </li>
      );
    });

  const inputFieldContentJSX =
    selectedElementsJSX.length === 0 ? (
      <div className="defaultText">{defaultText}</div>
    ) : (
      <ul className="selectedItemsList">{selectedElementsJSX}</ul>
    );

  return (
    <div className="dropdown">
      <div className="inputField" onClick={toggleDropdownHandler}>
        {inputFieldContentJSX}
        <div className="iconContainer">
          <i className={cn("arrow", { opened: isOpened })}></i>
        </div>
      </div>

      <div
        className={cn("menu", {
          opened: isOpened && dropdownElementsJSX.length !== 0,
        })}
      >
        {dropdownElementsJSX}
      </div>
    </div>
  );
};

export default Dropdown;
