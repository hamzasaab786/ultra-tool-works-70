import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Download, Loader2, GripVertical, Trash2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument } from "pdf-lib";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface PageInfo {
  id: string;
  pageNumber: number;
  thumbnail?: string;
}

const OrganizePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setIsLoading(true);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        const pageInfos: PageInfo[] = [];
        for (let i = 0; i < pageCount; i++) {
          pageInfos.push({
            id: `page-${i}`,
            pageNumber: i + 1,
          });
        }
        
        setPages(pageInfos);
        toast.success(`PDF loaded with ${pageCount} pages!`);
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF file");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPages(items);
  };

  const deletePage = (id: string) => {
    setPages(pages.filter((page) => page.id !== id));
    toast.success("Page removed");
  };

  const savePdf = async () => {
    if (!file || pages.length === 0) {
      toast.error("No pages to save");
      return;
    }

    setIsSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const page of pages) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [page.pageNumber - 1]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "_organized.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Organized PDF saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save organized PDF");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Organize PDF Pages"
      description="Reorder, rearrange, and delete PDF pages easily. Free online PDF page organizer tool."
      keywords="organize pdf, rearrange pdf pages, reorder pdf, pdf page organizer"
    >
      <div className="space-y-6">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Organize PDF Pages</h2>
              <p className="text-muted-foreground">
                Reorder and organize your PDF pages by dragging and dropping
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pdf-file"
                  className="block text-sm font-medium mb-2"
                >
                  Select PDF File
                </label>
                <input
                  id="pdf-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                />
              </div>

              {file && (
                <Card className="p-4 bg-muted/50">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pages.length} pages
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {isLoading && (
          <Card className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading PDF pages...</p>
          </Card>
        )}

        {pages.length > 0 && !isLoading && (
          <>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Pages ({pages.length})
                </h3>
                <Button onClick={savePdf} disabled={isSaving} size="lg">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Save Organized PDF
                    </>
                  )}
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="pages">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {pages.map((page, index) => (
                        <Draggable
                          key={page.id}
                          draggableId={page.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-4 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      Page {page.pageNumber}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Position: {index + 1}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deletePage(page.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">How to use:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Drag pages up or down to reorder them</li>
                <li>✓ Click trash icon to remove unwanted pages</li>
                <li>✓ Click "Save Organized PDF" when done</li>
                <li>✓ All changes are processed in your browser</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default OrganizePdf;
