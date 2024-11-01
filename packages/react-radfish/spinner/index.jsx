import "./style.css";

export const Spinner = ({
  color = "#0093d0",
  width = 50,
  height = 50,
  stroke = 8,
}) => {
  return (
    <div
      className="loading"
      style={{ borderTopColor: color, borderWidth: stroke, width, height }}
    ></div>
  );
};
