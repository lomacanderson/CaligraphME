import { DrawingCanvas } from "@/components/canvas/DrawingCanvas";

export function WritingPage() {
    const handleSubmit = (imageData: string, extractedText?: string, confidence?: number) => {
        console.log('📝 Canvas submitted');
        console.log('🖼️ Image data:', imageData.substring(0, 50) + '...');
        console.log('🔍 OCR extracted:', extractedText || '(none)');
        console.log('📊 Confidence:', confidence || 'N/A');
        // TODO: Implement writing practice submission
    };

    return (
        <div className="writing-page">
            <h1>Practice Writing</h1>
            <DrawingCanvas 
                onSubmit={handleSubmit}
                submitButtonText="Save Practice"
            />
        </div>
    );
}
