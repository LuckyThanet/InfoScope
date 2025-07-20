import type {
  InvestigationResults,
  InvestigationResult,
} from "../services/api/types/result";

type AnyObject = { [key: string]: any };

// ✅ แก้ไข parameter type และ logic
export const exportResultsToCSV = (caseData: InvestigationResults) => {
  const flattenResults = (): AnyObject[] => {
    const rows: AnyObject[] = [];

    // ✅ เปลี่ยนจาก caseData?.data?.results เป็น caseData.results
    const results = caseData?.results ?? [];
    if (!Array.isArray(results) || results.length === 0) {
      return rows;
    }

    results.forEach((tool: InvestigationResult) => {
      const tool_name = tool?.tool_name ?? "";
      const indicator_value = tool?.indicator_value ?? "";
      const result_data = tool?.result_data ?? {};

      if (tool_name === "whatmyname" && result_data && "found" in result_data) {
        // ✅ Type guard สำหรับ whatmyname
        const found = (result_data as any).found;
        if (Array.isArray(found)) {
          found.forEach((item: any) => {
            rows.push({
              tool_name,
              indicator_value,
              platform: item?.platform ?? "",
              link: item?.link ?? "",
            });
          });
        }
      } else if (tool_name === "whois" && result_data) {
        // ✅ Type guard สำหรับ whois
        rows.push({
          tool_name,
          indicator_value,
          ip: (result_data as any)?.ip ?? "",
          domain_name: (result_data as any)?.domain_name ?? "",
          registrar: (result_data as any)?.registrar?.name ?? "",
          created_at: (result_data as any)?.created_at ?? "",
          expires_at: (result_data as any)?.expires_at ?? "",
          status: Array.isArray((result_data as any)?.status)
            ? (result_data as any).status.join("; ")
            : (result_data as any)?.status ?? "",
        });
      } else if (
        tool_name === "hibp" &&
        result_data &&
        "breached" in result_data
      ) {
        // ✅ Type guard สำหรับ hibp
        rows.push({
          tool_name,
          indicator_value,
          breached: (result_data as any)?.breached ?? "",
          count: (result_data as any)?.count ?? "",
          message: (result_data as any)?.message ?? "",
        });
      } else {
        // ✅ สำหรับ tools อื่นๆ
        rows.push({
          tool_name,
          indicator_value,
          indicator_type: tool?.indicator_type_name ?? "",
          raw_json: JSON.stringify(result_data),
        });
      }
    });

    return rows;
  };

  const convertToCSV = (arr: AnyObject[]): string => {
    const headers = Array.from(new Set(arr.flatMap((obj) => Object.keys(obj))));
    const csvRows = [
      headers.join(","),
      ...arr.map((obj) =>
        headers
          .map((field) => {
            const value = obj[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  const rows = flattenResults();
  if (rows.length === 0) {
    alert("ไม่มีข้อมูลให้ export");
    return;
  }

  const csv = "\ufeff" + convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  // ✅ เปลี่ยนจาก caseData?.data?.case_name เป็น caseData.case_name
  a.download = `${caseData?.case_name ?? "export"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ✅ เพิ่ม function สำหรับ export JSON
export const exportResultsToJSON = (caseData: InvestigationResults) => {
  const jsonData = JSON.stringify(caseData, null, 2);
  const blob = new Blob([jsonData], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${caseData?.case_name ?? "export"}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
