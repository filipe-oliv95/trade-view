import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function MuiCard({ children }) {
  return (
    <Card sx={{ height: "100%", borderRadius: "20px" }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default MuiCard;
