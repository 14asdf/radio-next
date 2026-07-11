import Link from 'next/link';
import { Card } from '@/components/ui/card';

const StationCard = ({ station, href }) => {
  return (
    <Link href={href} className="block w-full">
      <Card className="overflow-hidden border-0 shadow-none">
        <div className="relative aspect-square w-full">
          <img src={station.img} alt={station.title} className="size-full object-cover" />
        </div>
        <div className="flex flex-col gap-1 p-2">
          <p className="truncate text-sm font-medium">{station.title}</p>
        </div>
      </Card>
    </Link>
  );
};

export default StationCard;
