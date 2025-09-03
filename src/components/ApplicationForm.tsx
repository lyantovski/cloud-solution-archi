import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, CheckCircle, AlertCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ApplicationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ApplicationData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedIn: string
  currentRole: string
  yearsExperience: string
  coverLetter: string
  cvFileName: string
  submittedAt: string
}

export function ApplicationForm({ open, onOpenChange }: ApplicationFormProps) {
  const [applications, setApplications] = useKV<ApplicationData[]>("applications", [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    currentRole: '',
    yearsExperience: '',
    coverLetter: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast.error('Please upload a PDF or Word document')
        return
      }
      setCvFile(file)
    }
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'currentRole', 'yearsExperience']
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    
    if (missing.length > 0) {
      toast.error('Please fill in all required fields')
      return false
    }
    
    if (!cvFile) {
      toast.error('Please upload your CV')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newApplication: ApplicationData = {
        id: applicationId,
        ...formData,
        cvFileName: cvFile!.name,
        submittedAt: new Date().toISOString()
      }
      
      setApplications(currentApplications => [...currentApplications, newApplication])
      
      toast.success('Application submitted successfully! We\'ll be in touch soon.')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedIn: '',
        currentRole: '',
        yearsExperience: '',
        coverLetter: ''
      })
      setCvFile(null)
      onOpenChange(false)
      
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for Cloud Solution Architect</DialogTitle>
          <DialogDescription>
            Submit your application to join Microsoft's cloud solutions team. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                <Input
                  id="linkedIn"
                  value={formData.linkedIn}
                  onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Experience */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Professional Experience</h3>
              <div>
                <Label htmlFor="currentRole">Current Role/Title *</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  placeholder="Senior Cloud Architect"
                  required
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="yearsExperience">Years of Cloud Experience *</Label>
                <Input
                  id="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  placeholder="8 years"
                  required
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* CV Upload */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Upload CV/Resume *</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    {cvFile ? (
                      <>
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <p className="text-sm font-medium">{cvFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload your CV</p>
                        <p className="text-xs text-muted-foreground">
                          PDF or Word document, max 10MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}