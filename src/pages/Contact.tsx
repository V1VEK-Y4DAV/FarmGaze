import { motion } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          {/* Contact Header */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#4c871e]/5 dark:bg-[#4c871e]/10" />
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-[#6ba32a]"
              >
                Contact Us
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg"
              >
                Have questions or need assistance? We're here to help you with your farming needs.
              </motion.p>
            </div>
          </motion.section>

          {/* Contact Form and Info */}
          <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-[#4c871e]/5 dark:bg-[#4c871e]/10">
                      <CardTitle className="text-2xl font-bold text-[#4c871e]">Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <Input 
                              id="name" 
                              placeholder="Your name" 
                              className="focus:ring-2 focus:ring-[#4c871e] focus:border-[#4c871e] transition-all duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="your@email.com"
                              className="focus:ring-2 focus:ring-[#4c871e] focus:border-[#4c871e] transition-all duration-300"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                          <Input 
                            id="subject" 
                            placeholder="Subject"
                            className="focus:ring-2 focus:ring-[#4c871e] focus:border-[#4c871e] transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                          <Textarea 
                            id="message" 
                            placeholder="Your message" 
                            className="min-h-[150px] focus:ring-2 focus:ring-[#4c871e] focus:border-[#4c871e] transition-all duration-300"
                          />
                        </div>
                        <Button 
                          className="w-full bg-[#4c871e] hover:bg-[#4c871e]/90 text-white font-semibold py-6 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-8"
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <motion.div 
                          className="flex items-start group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-[#4c871e]/10 flex items-center justify-center mr-4 group-hover:bg-[#4c871e]/20 transition-colors duration-300">
                            <Mail className="h-6 w-6 text-[#4c871e]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300 hover:text-[#4c871e] transition-colors duration-300">support@farmgaze.com</p>
                            <p className="text-gray-600 dark:text-gray-300 hover:text-[#4c871e] transition-colors duration-300">info@farmgaze.com</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-[#4c871e]/10 flex items-center justify-center mr-4 group-hover:bg-[#4c871e]/20 transition-colors duration-300">
                            <Phone className="h-6 w-6 text-[#4c871e]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Phone</h3>
                            <p className="text-gray-600 dark:text-gray-300 hover:text-[#4c871e] transition-colors duration-300">+1 (555) 123-4567</p>
                            <p className="text-gray-600 dark:text-gray-300 hover:text-[#4c871e] transition-colors duration-300">+1 (555) 987-6543</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-[#4c871e]/10 flex items-center justify-center mr-4 group-hover:bg-[#4c871e]/20 transition-colors duration-300">
                            <MapPin className="h-6 w-6 text-[#4c871e]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Address</h3>
                            <p className="text-gray-600 dark:text-gray-300">123 Farm Street</p>
                            <p className="text-gray-600 dark:text-gray-300">Agricultural District</p>
                            <p className="text-gray-600 dark:text-gray-300">Farmville, CA 12345</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-[#4c871e]/10 flex items-center justify-center mr-4 group-hover:bg-[#4c871e]/20 transition-colors duration-300">
                            <Clock className="h-6 w-6 text-[#4c871e]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Working Hours</h3>
                            <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p className="text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                            <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Media */}
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <h3 className="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Follow Us</h3>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                          { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                          { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' },
                          { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
                        ].map((social, index) => (
                          <motion.div
                            key={social.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="w-12 h-12 rounded-full border-2 border-[#4c871e]/20 hover:border-[#4c871e] transition-colors duration-300"
                            >
                              <svg className="h-6 w-6 text-[#4c871e]" fill="currentColor" viewBox="0 0 24 24">
                                <path d={social.icon} />
                              </svg>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
