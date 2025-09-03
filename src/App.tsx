import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Cloud, Code, Users, CheckCircle, ArrowRight, Upload, Building, Calendar } from '@phosphor-icons/react'
import { ApplicationForm } from '@/components/ApplicationForm'
import { RequirementsChecker } from '@/components/RequirementsChecker'

function App() {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showRequirementsChecker, setShowRequirementsChecker] = useState(false)

  const keyResponsibilities = [
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Business Impact",
      description: "Drive complex customers to operational readiness and business goal achievement through proven methodologies and architectures."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Centricity", 
      description: "Act as voice of customer, building relationships with C-suite executives and translating problems into industry solutions."
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Partner Specialization",
      description: "Lead strategic opportunities and collaborate with partners to develop scalable offerings and solutions."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Technical Leadership",
      description: "Mentor teams, lead virtual teams, and drive technical readiness across Microsoft architectures."
    }
  ]

  const requiredSkills = [
    "Azure AI Foundry", "AKS", "App Service", "Azure Cosmos DB", "Azure SQL Databases", 
    "Azure Database for PostgreSQL", "APIM", "GitHub", "DevOps", "Enterprise Architecture"
  ]

  const qualifications = [
    "Bachelor's degree in Computer Science, Engineering, Business, or related field",
    "7+ years of experience in cloud and hybrid infrastructure technologies",
    "Experience with enterprise-scale application portfolios",
    "Proficiency in Azure services or equivalent cloud platforms",
    "Strong communication skills and ability to lead virtual teams"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <Building className="h-4 w-4 mr-2" />
              Microsoft Cloud Solutions
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Cloud Solution Architect
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Lead enterprise cloud transformations, shape Microsoft's technical strategy, and mentor teams 
              while driving customer success at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowApplicationForm(true)}
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowRequirementsChecker(true)}
              >
                Check Your Fit
                <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Information */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-semibold mb-2">Microsoft</h3>
                <p className="text-muted-foreground">Global technology leader</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-semibold mb-2">Full-time</h3>
                <p className="text-muted-foreground">Senior level position</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Cloud className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-semibold mb-2">7+ Years</h3>
                <p className="text-muted-foreground">Cloud experience required</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Responsibilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Key Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {keyResponsibilities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {item.icon}
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Required Skills */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Required Technical Skills</h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {requiredSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Minimum Qualifications</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {qualifications.map((qualification, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base leading-relaxed">{qualification}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Shape the Future of Cloud?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join Microsoft's cloud solutions team and help enterprises worldwide achieve their digital transformation goals.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => setShowApplicationForm(true)}
            >
              <Upload className="mr-2 h-5 w-5" />
              Submit Your Application
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Application Form Modal */}
      <ApplicationForm 
        open={showApplicationForm} 
        onOpenChange={setShowApplicationForm} 
      />

      {/* Requirements Checker Modal */}
      <RequirementsChecker 
        open={showRequirementsChecker} 
        onOpenChange={setShowRequirementsChecker} 
      />
    </div>
  )
}

export default App