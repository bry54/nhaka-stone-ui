import { Fragment } from 'react';
import { Link } from 'react-router';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  QrCode,
  Image as ImageIcon,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex grow flex-col in-data-[sticky-header=on]:pt-(--header-height-default)">
      <main className="grow" role="content">
        <Fragment>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 py-20 lg:py-32">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl" />

            <Container className="relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="outline" className="mx-auto px-4 py-1.5 text-sm font-medium border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 inline text-blue-600 dark:text-blue-400" />
                  Digital Memorial Platform
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent leading-tight">
                  Honor Their Memory,
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Forever Cherished
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Create lasting tributes for your loved ones. Share memories, photos, and stories that bridge physical memorials with digital remembrance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300" asChild>
                    <Link to="/auth/signup">
                      Sign-up To Create Memorial Spaces
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 hover:bg-slate-50 dark:hover:bg-slate-900">
                    Learn More
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>Easy to Use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>Forever Accessible</span>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* Features Section */}
          <section className="py-20 lg:py-28 bg-white dark:bg-slate-950">
            <Container>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Everything You Need to Remember
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Our platform provides all the tools to create meaningful, lasting tributes that celebrate life and preserve memories.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Feature Card 1 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Memorial Spaces</CardTitle>
                    <CardDescription className="text-base">
                      Purchase dedicated digital spaces to honor your loved ones with personalized tributes and memories.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Feature Card 2 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Photo & Video Galleries</CardTitle>
                    <CardDescription className="text-base">
                      Share cherished photos and videos that capture precious moments and celebrate their life story.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Feature Card 3 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Community Memories</CardTitle>
                    <CardDescription className="text-base">
                      Friends and family can contribute their own stories, prayers, and memories to the tribute.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Feature Card 4 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">QR Code Integration</CardTitle>
                    <CardDescription className="text-base">
                      Bridge physical memorial sites with digital content through scannable QR codes on headstones.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Feature Card 5 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Privacy & Security</CardTitle>
                    <CardDescription className="text-base">
                      Control who can view and contribute to memorials with robust privacy settings and secure storage.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Feature Card 6 */}
                <Card className="group border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Eternal Preservation</CardTitle>
                    <CardDescription className="text-base">
                      Memories are preserved forever with reliable cloud storage and automatic backups.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </Container>
          </section>

          {/* QR Code Feature Highlight */}
          <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

            <Container className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Badge variant="outline" className="border-blue-400/50 bg-blue-500/10 text-blue-300">
                    <QrCode className="w-3.5 h-3.5 mr-1.5 inline" />
                    Innovative Technology
                  </Badge>

                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                    Connect Physical & Digital Memories
                  </h2>

                  <p className="text-lg text-slate-300 leading-relaxed">
                    Place a QR code at the physical memorial site. Visitors can scan it with their phone to instantly access the digital tribute, view photos, read stories, and leave their own memories.
                  </p>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Easy Access</strong>
                        <p className="text-slate-300">No app download required - works with any smartphone camera</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Weather Resistant</strong>
                        <p className="text-slate-300">Durable QR codes designed for outdoor memorial sites</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Instant Updates</strong>
                        <p className="text-slate-300">Content updates automatically without changing the QR code</p>
                      </div>
                    </li>
                  </ul>

                  <Button size="lg" variant="secondary" className="mt-4">
                    Learn About QR Integration
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 flex items-center justify-center">
                    <div className="w-full max-w-sm aspect-square bg-white rounded-xl p-6 flex items-center justify-center shadow-2xl">
                      <QrCode className="w-full h-full text-slate-900" strokeWidth={0.5} />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                </div>
              </div>
            </Container>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900">
            <Container>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Trusted by Families Worldwide
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  See how our platform has helped families preserve and celebrate the memories of their loved ones.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {/* Testimonial 1 */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      "This platform gave us a beautiful way to honor my father's memory. The QR code at his grave allows visitors to see his life story and leave their own memories."
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        SM
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Sarah Mitchell</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">California, USA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial 2 */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      "The ability to share photos and stories from our entire family has created a living tribute that grows with time. It's incredibly meaningful."
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                        JT
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">James Thompson</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">London, UK</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial 3 */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      "Simple, elegant, and secure. We can control who sees what, and knowing these memories are preserved forever brings us peace."
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold">
                        MC
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Maria Chen</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sydney, Australia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            <Container className="relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Start Creating a Lasting Tribute Today
                </h2>

                <p className="text-xl text-blue-50 leading-relaxed">
                  Join thousands of families who have chosen to preserve their loved ones' memories with dignity and love.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-xl hover:shadow-2xl transition-all duration-300">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/30 text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </div>

                <p className="text-sm text-blue-100 pt-4">
                  No credit card required • 30-day money-back guarantee • Cancel anytime
                </p>
              </div>
            </Container>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-slate-900 dark:bg-slate-950 text-slate-400">
            <Container>
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-400" />
                    Memorial Platform
                  </h3>
                  <p className="text-sm">
                    Honoring memories, celebrating lives, preserving legacies for generations to come.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">QR Codes</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-8 text-center text-sm">
                <p>© 2026 Memorial Platform. All rights reserved. Made with ❤️ to honor those we love.</p>
              </div>
            </Container>
          </footer>
        </Fragment>
      </main>
    </div>
  );
}
