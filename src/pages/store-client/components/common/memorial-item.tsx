import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCode from 'qrcode'
import { IMemorial } from '@/types/memorial.types';
import { useState } from 'react';


interface ICard2Props {
  memorial: IMemorial
}

export function MemorialItem({ memorial }: ICard2Props) {

  const [srcUrl, setSrcUrl] = useState('no')

  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark: "#000",
      light: "#fff"
    }
  }

  QRCode.toDataURL('memorial?.qrCode?.code', opts, function (err, url) {
    if (err) throw err
    //setSrcUrl(url)
  })

  return (
    <Card>
      <CardContent className="flex flex-col justify-between p-2.5 gap-4">
        <div className="mb-2.5">
          <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4  shadow-none">
            <img
              onClick={() => console.log('Clicked memorial item image')}
              src={srcUrl}
              className="h-[180px] shrink-0 cursor-pointer"
              alt="image"
            />
          </Card>

          <div
            onClick={() => console.log('Clicked memorial item image')}
            className="hover:text-primary text-sm font-medium text-mono px-2.5 leading-5.5 block cursor-pointer"
          >
            {memorial.title}
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-between gap-5 px-2.5 pb-1">
          <Badge
            size="sm"
            variant={memorial.isConfirmed ? "warning" : "secondary"}
            shape="circle"
            className="rounded-full gap-1"
          >
            <Star
              className="text-white -mt-0.5"
              style={{ fill: 'currentColor' }}
            />{' '}
            {'star'}
          </Badge>

          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-sm font-medium text-mono">{ }</span>

            <Button
              size="sm"
              variant="outline"
              className="ms-1"
              onClick={() => console.log('Clicked Button')}
            >
              <ShoppingCart /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
