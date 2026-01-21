import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { User, PenSquare, Image, MessageSquare, ScanQrCode } from 'lucide-react';

export function BrandedLayout() {
  return (
    <div className="grid lg:grid-cols-2 grow">
      <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1">
        <Card className="w-full max-w-[400px]">
          <CardContent className="p-4">
            <Outlet />
          </CardContent>
        </Card>
      </div>

      <div className="lg:rounded-xl lg:border lg:border-border lg:m-5 order-1 lg:order-2 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="flex flex-col p-8 lg:p-16 gap-8 h-full justify-center">
          <Link to="/" className="self-start">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[28px] max-w-none"
              alt=""
            />
          </Link>

          <div className="flex flex-col gap-8">
            <h2 className="text-2xl lg:text-3xl font-medium text-blue-900 dark:text-blue-100 leading-tight">
              Keep their memory alive for <span className="font-bold">generations</span>
            </h2>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Create a <strong>personalised memorial profile</strong> for your loved one
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <PenSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Write a <strong>biography</strong> to share their life story
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Bring their story to life with <strong>photos and videos</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Friends, family & visitors can add <strong>heartfelt tribute comments</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <ScanQrCode className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Share the QR code with friends and family <strong> from anywhere in the world</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
