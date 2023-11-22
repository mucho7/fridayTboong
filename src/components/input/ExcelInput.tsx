import { ChangeEvent, useState } from "react";
import { read, utils } from "xlsx";
import "./Excelnput.css";

type ExcelInputProps = {
  setExcelFile: (file: string[][]) => void;
};

const ExcelInput = (props: ExcelInputProps) => {
  const { setExcelFile } = props;
  const [filePath, setFilePath] = useState<string>("");

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    file && setFilePath(file.name);
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
    <div className="filebox">
      <input
        className="upload-name"
        value={filePath || "근태 엑셀 파일 찾기"}
        placeholder="근태 엑셀 파일 찾기"
        readOnly
      />
      <label htmlFor="file">파일찾기</label>
      <input type="file" id="file" onChange={handleFile} />
    </div>
  );
};

export default ExcelInput;
