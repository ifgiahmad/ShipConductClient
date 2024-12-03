import { Card, CardContent } from "../ui/card";
const DashboardCard = () => {
  return (
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardContent>
        <h3 className="text-3xl text-center mb-4 font-bold">
          welcome to the shipconduct app
        </h3>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
