"use server";

export const imagesLoading = (message: string) => {
  return (
    <div className="toast toast-end">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
};

export const imageLoaded = (message: string) => {
  return (
    <div className="toast toast-end">
      <div className="alert alert-success">
        <span>{message}</span>
      </div>
    </div>
  );
};
