import { useState, ChangeEvent } from "react";
import { read, utils } from "xlsx";
import WorkTimeView from "./WorkTimeView";

const ExcelInput = () => {
  const [excelFile, setExcelFile] = useState<string[][]>([]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target && event.target.result;
      const workbook = read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: string[][] = utils.sheet_to_json(sheet, {
        header: 1,
      });
      setExcelFile(jsonData.slice(1));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      {excelFile.length !== 0 ? <WorkTimeView excelFile={excelFile} /> : <></>}
      <input
        type="file"
        onChange={handleFile}
        accept=".xlsx"
        multiple={false}
      />
    </>
  );
};

export default ExcelInput;
