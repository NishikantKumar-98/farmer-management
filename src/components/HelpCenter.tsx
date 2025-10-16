import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  Book,
  Video,
  FileText
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I register as a buyer?',
        a: 'Click on the Register button, select "I\'m a Buyer", fill in your details, and submit. You\'ll receive a verification email to complete the registration.'
      },
      {
        q: 'How do I register as a farmer?',
        a: 'Click on the Register button, select "I\'m a Farmer", provide your farm details and certifications. Our team will verify your farm within 24-48 hours.'
      },
      {
        q: 'Is there a registration fee?',
        a: 'No, registration is completely free for both buyers and farmers on AgriConnect.'
      }
    ]
  },
  {
    category: 'Orders & Payments',
    questions: [
      {
        q: 'How do I place a pre-order?',
        a: 'Browse farms, select a crop, click "Pre-Order", enter quantity and delivery details, then make the advance payment (typically 20%).'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI, Credit/Debit Cards, Net Banking, and digital wallets. All payments are processed securely.'
      },
      {
        q: 'Can I cancel my order?',
        a: 'Yes, orders can be cancelled within 24 hours of placement for a full refund. After that, cancellation terms depend on the specific contract.'
      },
      {
        q: 'How is payment split?',
        a: 'Typically 20-30% advance at order placement, and remaining 70-80% upon delivery. Specific terms vary by contract.'
      }
    ]
  },
  {
    category: 'Quality & Delivery',
    questions: [
      {
        q: 'How are crops quality-assured?',
        a: 'All crops go through quality checks based on contract specifications. Certified farms follow organic and quality standards verified by regulatory bodies.'
      },
      {
        q: 'What if I receive poor quality produce?',
        a: 'You can file a quality dispute within 24 hours of delivery. Our team will inspect and resolve based on contract terms.'
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery times vary by crop and location. Check the "Available in X days" indicator on each crop listing.'
      }
    ]
  },
  {
    category: 'Platform Features',
    questions: [
      {
        q: 'What is the Compare Farms feature?',
        a: 'Select up to 4 farms to compare their prices, certifications, ratings, and available crops side-by-side.'
      },
      {
        q: 'How do Price Alerts work?',
        a: 'Set target prices for crops you\'re interested in. You\'ll receive notifications when prices reach your target.'
      },
      {
        q: 'Can I chat with farmers directly?',
        a: 'Yes! Use the messaging feature to communicate directly with farmers about crop details, delivery, or custom requirements.'
      }
    ]
  }
];

const guides = [
  { title: 'Getting Started Guide', icon: Book, time: '5 min read' },
  { title: 'How to Place Your First Order', icon: Video, time: '3 min video' },
  { title: 'Understanding Contracts', icon: FileText, time: '7 min read' },
  { title: 'Quality Standards Explained', icon: Book, time: '4 min read' },
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket created! We\'ll respond within 24 hours.');
    setSupportForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-2">How can we help you?</h2>
        <p className="text-gray-600 mb-6">
          Find answers, get support, or learn how to use AgriConnect
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          {filteredFaqs.length === 0 ? (
            <Card className="p-12 text-center">
              <HelpCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl mb-2 text-gray-600">No results found</h3>
              <p className="text-gray-500">Try a different search term</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category, catIdx) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 }}
                >
                  <h3 className="text-xl mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded"></div>
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, idx) => (
                      <AccordionItem key={idx} value={`${catIdx}-${idx}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="text-left">{faq.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2">{guide.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {guide.time}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card className="p-6">
              <h3 className="text-xl mb-4">Send us a message</h3>
              <form onSubmit={handleSubmitSupport} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Chat with our support team in real-time
                    </p>
                    <Button variant="outline" size="sm">Start Chat</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      support@agriconnect.com
                    </p>
                    <p className="text-xs text-gray-500">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      1800-123-4567 (Toll Free)
                    </p>
                    <p className="text-xs text-gray-500">
                      Mon-Fri, 9 AM - 6 PM IST
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
