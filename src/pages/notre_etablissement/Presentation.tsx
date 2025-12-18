import React from "react";
import { dataText } from "../../dataMenu/textData";
import { dataText1 } from "../../dataMenu/textData";
import { dataText2 } from "../../dataMenu/textData";
import Page from "../../components/Page";
import { useGetPresentation } from "../../hooks/useSite";
import Page2 from "../../components/Page2";

const Presentation: React.FC = () => {
  const { data: listData, isLoading: loadData, isError } = useGetPresentation()

  const hasBackendImages =
    !!listData &&
    listData.length > 0 &&
    listData.some((item) => {
      const img = item.image

      if (typeof img === "string") {
        return img.trim() !== ""
      }

      if (img instanceof File) {
        return true
      }

      return false
    })

  return (
    <>
      {isError || loadData || !hasBackendImages ? (
        <div>
        <Page dataText={dataText} />
        <Page dataText={dataText1} />
        <Page dataText={dataText2} />
        </div>
      ) : (
        <Page2 presentations={listData} />
      )}
    </>
  )
}

export default Presentation;
