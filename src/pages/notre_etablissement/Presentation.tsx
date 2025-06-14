import React from "react";
import { dataText } from "../../dataMenu/textData";
import Page from "../../components/Page";
import { useGetPresentation } from "../../hooks/useSite";
import Page2 from "../../components/Page2";

const Presentation: React.FC = () => {
  const { data: listData, isLoading: loadData, isError } = useGetPresentation();
  return (
    <>
      {isError || loadData ? (
        <Page dataText={dataText} />
      ) : (
        <Page2 presentations={listData} />
      )}
    </>
  );
};

export default Presentation;
