/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

//improve the Modal using a react portal... a react portal is a feature
//that essentially allows us to render an element outside of the parent
//component dom structure while still keeping the element in the original
//position of the component tree.
//in order word with a portal you can basically render a component in any
//place that we want inside the DOM tree but still leave the componenet
//at the same place in the react compoenent tree, so tehn things like props
//keep working normally.
//this is greate and generally used for all elements that we want to stay
//ontop of other element so things like modal window, tooltips, menus and so on.
const ModalContext = createContext();
function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  //click outside the modal use a ref
  const ref = useOutsideClick(close);
  // const ref = useRef();
  // useEffect(
  //   function () {
  //     function handleClick(e) {
  //       //if the ref.current does not contain the event that was clicked close the modal
  //       if (ref.current && !ref.current.contains(e.target)) close();
  //     }
  //     document.addEventListener("click", handleClick, true);

  //     return () => document.removeEventListener("click", handleClick, true);
  //   },
  //   [close]
  // );

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    //DOM node where we want to render this jsx
    document.body
    //or document.querySelector()
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
