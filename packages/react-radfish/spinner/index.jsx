import "./style.css";

export const Spinner = ({ color, width, height, stroke }) => {
  return (
    <div
      class="loading"
      style={{ borderTopColor: color, borderWidth: stroke, width, height }}
    ></div>
  );
};
