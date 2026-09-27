import Link from "next/link";
import AdSlot from "../../components/AdSlot";
import PdfPagePreviewTool from "../../components/PdfPagePreviewTool";
import RelatedTools from "../../components/RelatedTools";
import ToolSeo from "../../components/ToolSeo";

export const metadata={
 title:"PDF Page Preview & Select Pages Online Free",
 description:"Preview PDF pages, select the pages you need, and export them as a new PDF directly in your browser."
};

export default function Page(){
 return <main className="toolpage">
  <Link href="/">← All tools</Link>
  <h1>PDF Page Preview</h1>
  <p className="lead">Preview every PDF page, select the pages you want, and export a clean new PDF.</p>
  <AdSlot/>
  <PdfPagePreviewTool/>
  <AdSlot/>
  <ToolSeo
   title="Preview and select PDF pages"
   intro="A visual page selector for PDFs. Review thumbnails before choosing pages, keep only the pages you need, and create a new PDF without uploading the source file."
   useCases={["Extract a custom set of pages","Remove pages by selecting only the pages to keep","Review long PDFs visually before exporting","Create smaller custom PDFs for sharing or printing"]}
   links={[["Extract PDF Pages","/extract-pages-from-pdf/"],["Delete PDF Pages","/delete-pages-from-pdf/"],["Reorder PDF Pages","/reorder-pdf/"],["PDF to JPG","/pdf-to-jpg/"],["PDF to PNG","/pdf-to-png/"]]}
   faq={[
    ["Is the PDF uploaded?","No. The supported preview and export workflow processes the PDF in your browser."],
    ["Can I select individual pages?","Yes. Click any thumbnail to select or deselect it."],
    ["Can I keep pages in their original order?","Yes. Selected pages are exported in their original page order."],
    ["What does the download contain?","A new PDF containing only the pages you selected."]
   ]}
  />
  <RelatedTools/>
 </main>
}
