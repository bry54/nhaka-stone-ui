import { ShoppingCart, CheckCircle2, Globe, QrCode, Calendar, MapPin, MessageSquare, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import QRCodeLib from 'qrcode';
import { IMemorial } from '@/types/memorial.types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface ICard2Props {
  memorial: IMemorial
}

export function MemorialItem({ memorial }: ICard2Props) {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (memorial?.qrCode?.code) {
      QRCodeLib.toDataURL(memorial.qrCode.code, opts, function (err, url) {
        if (err) {
          console.error('QR Code generation error:', err)
          return
        }
        setSrcUrl(url)
      })
    }
  }, [memorial])

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleViewContributions = () => {
    navigate(`/store-client/memorial-reviews?memorialId=${memorial.id}`);
  };

  const handleConfigure = () => {
    // TODO: Implement configuration functionality
    console.log('Configure memorial:', memorial.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {/* Status Badges Row */}
        <div className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-accent/30 to-accent/10">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              size="sm"
              variant={memorial.isConfirmed ? "primary" : "secondary"}
              className="gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              {memorial.isConfirmed ? 'Confirmed' : 'Pending'}
            </Badge>

            <Badge
              size="sm"
              variant={memorial.isPublic ? "primary" : "outline"}
              className="gap-1"
            >
              <Globe className="w-3 h-3" />
              {memorial.isPublic ? 'Public' : 'Private'}
            </Badge>

            <Badge
              size="sm"
              variant={memorial.qrCode?.isActive ? "primary" : "destructive"}
              className="gap-1"
            >
              <QrCode className="w-3 h-3" />
              {memorial.qrCode?.isActive ? 'QR Active' : 'QR Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* QR Code Section */}
        <div className="flex flex-col items-center mb-4">
          <Card className="flex items-center justify-center relative bg-gradient-to-br from-accent/20 to-accent/5 w-[180px] h-[180px] mb-3 shadow-sm border-2">
            <img
              key={srcUrl}
              onClick={() => console.log('Clicked memorial QR code')}
              src={srcUrl}
              className="w-[160px] h-[160px] cursor-pointer hover:scale-105 transition-transform"
              alt={`QR Code for ${memorial.title}`}
            />
          </Card>

          <h3 className="text-base font-semibold text-center mb-1 hover:text-primary cursor-pointer transition-colors">
            {memorial.title}
          </h3>
        </div>

        {/* Deceased Person Information */}
        {memorial.deceasedPerson && (
          <div className="space-y-2 mb-4 p-3 bg-accent/10 rounded-lg border">
            <div className="text-center mb-2">
              <p className="font-semibold text-lg">{memorial.deceasedPerson.fullName}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Born:</span>
                <span className="font-medium">{formatDate(memorial.deceasedPerson.dateOfBirth)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Passed:</span>
                <span className="font-medium">{formatDate(memorial.deceasedPerson.dateOfDeath)}</span>
              </div>

              {memorial.deceasedPerson.placeOfDeath && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Place:</span>
                  <span className="font-medium truncate">{memorial.deceasedPerson.placeOfDeath}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewContributions}
            className="flex-1 gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            View Contributions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleConfigure}
            disabled
            className="flex-1 gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
