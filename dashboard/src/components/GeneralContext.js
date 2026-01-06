import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  openSellWindow: (uid) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isActionWindowOpen, setIsActionWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [actionType, setActionType] = useState("");

  const openBuyWindow = (uid) => {
    setIsActionWindowOpen(true);
    setSelectedStockUID(uid);
    setActionType("BUY");
  };

  const openSellWindow = (uid) => {
    setIsActionWindowOpen(true);
    setSelectedStockUID(uid);
    setActionType("SELL");
  };

  const closeActionWindow = () => {
    setIsActionWindowOpen(false);
    setSelectedStockUID("");
    setActionType("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        openSellWindow,
        closeActionWindow,
      }}
    >
      {props.children}

      {isActionWindowOpen && actionType === "BUY" && (
        <BuyActionWindow uid={selectedStockUID} />
      )}

      {isActionWindowOpen && actionType === "SELL" && (
        <SellActionWindow uid={selectedStockUID} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
