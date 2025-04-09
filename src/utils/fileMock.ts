
// This utility creates fake File objects that are compatible with our processing functions
// In a real-world application with actual file processing, this would be unnecessary

export const createMockPdf = (name: string, size: number = 100000): File => {
  const content = `Mock PDF content for ${name}`;
  const blob = new Blob([content], { type: 'application/pdf' });
  return new File([blob], name, { type: 'application/pdf', lastModified: Date.now() });
};

export const createMockWord = (name: string, size: number = 100000): File => {
  const content = `Mock Word content for ${name}`;
  const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  return new File([blob], name, { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    lastModified: Date.now() 
  });
};

export const createMockImage = (name: string, size: number = 100000): File => {
  const content = `Mock image content for ${name}`;
  const blob = new Blob([content], { type: 'image/jpeg' });
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
};
