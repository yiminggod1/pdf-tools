import type {Metadata} from "next";
import Link from "next/link";
import PdfToPngTool from "../../components/PdfToPngTool";
import AdSlot from "../../components/AdSlot";
import RelatedTools from "../../components/RelatedTools";
import ToolSeo from "../../components/ToolSeo";

export const metadata:Metadata={
 title:"PDF to PNG Converter Online Free",
 description:"Convert PDF pages to PNG images online free in your browser. Render PDF pages locally and download them as PNG files."
};

export default function Page(){
 return <main className="toolpage">
  <Link href="/">← All tools</Link>
  <h1>PDF to PNG</h1>
  <p className="lead">Convert every page of a PDF into PNG images directly in your browser.</p>
  <AdSlot/>
  <PdfToPngTool/>
  <AdSlot/>
  <ToolSeo
   title="Convert PDF pages to PNG images"
   intro="Render PDF pages as PNG images locally in your browser. The result is a ZIP containing one PNG image for each PDF page."
   useCases={[
    "Turn PDF pages into lossless PNG image files",
    "Create high-quality document previews",
    "Prepare PDF pages for image-based workflows",
    "Extract visual pages for editing or publishing"
   ]}
   links={[
    ["PDF to JPG","/pdf-to-jpg/"],
    ["JPG to PDF","/jpg-to-pdf/"],
    ["PNG to PDF","/png-to-pdf/"],
    ["Split PDF","/split-pdf/"]
   ]}
   faq={[
    ["Is PDF to PNG free?","Yes. The supported conversion is free and runs in your browser."],
    ["What do I download?","The tool creates a ZIP containing one PNG image for each PDF page."],
    ["Is my PDF uploaded?","The supported rendering workflow processes the PDF locally in your browser."],
    ["Does the original PDF change?","No. The source PDF remains unchanged and a new set of PNG images is created."]
   ]}
  />
  <RelatedTools/>
 </main>;
}
