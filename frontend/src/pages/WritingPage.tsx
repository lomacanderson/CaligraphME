import { DrawingCanvas } from "@/components/canvas/DrawingCanvas";

export function WritingPage() {
    const handleSubmit = (imageData: string) => {
        console.log('Canvas submitted:', imageData);
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
