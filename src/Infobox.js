import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./Infobox.css";

function Infobox({ title, cases, active, total, isRed, ...props }) {
  return (
    <div>
      <Card
        className={`infobox ${active ? "isActive " : ""} ${
          isRed ? "infored" : ""
        }`}
        variant="outlined"
        onClick={props.onClick}
      >
        <CardContent>
          <Typography color="textSecondary" className="infobox__title">
            {title}
          </Typography>
          <h2 className="infobox__cases">{cases}</h2>
          <Typography className="infobox__total" color="textSecondary">
            {total}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Infobox;
