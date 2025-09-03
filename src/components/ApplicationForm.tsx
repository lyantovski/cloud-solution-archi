import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, User, Mail, Phone, FileText, Send } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ApplicationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplicationSubmitted?: (application: any) => void
}

export function ApplicationForm({ open, onOpenChange, onApplicationSubmitted }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    experience: '',
    coverLetter: '',
    resumeFile: null as File | null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast.error('Please upload a PDF or DOC file')
        return
      }
      setFormData(prev => ({ ...prev, resumeFile: file }))
      toast.success('Resume uploaded successfully')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.resumeFile) {
      toast.error('Please fill in all required fields and upload your resume')
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare application details for email
      const applicationDetails = {
        id: Date.now().toString(),
        applicantName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        linkedinUrl: formData.linkedinUrl || 'Not provided',
        experience: formData.experience || 'Not specified',
        coverLetter: formData.coverLetter || 'No cover letter provided',
        resumeFileName: formData.resumeFile.name,
        submissionDate: new Date().toLocaleString(),
        position: 'Cloud Solution Architect',
        status: 'submitted'
      }

      // Save application data
      if (onApplicationSubmitted) {
        onApplicationSubmitted(applicationDetails)
      }

      // Create email content using LLM
      const emailPrompt = spark.llmPrompt`
        Create a professional email notification for a job application submission with the following details:
        
        Position: ${applicationDetails.position}
        Applicant: ${applicationDetails.applicantName}
        Email: ${applicationDetails.email}
        Phone: ${applicationDetails.phone}
        LinkedIn: ${applicationDetails.linkedinUrl}
        Experience: ${applicationDetails.experience}
        Resume File: ${applicationDetails.resumeFileName}
        Submission Date: ${applicationDetails.submissionDate}
        
        Cover Letter:
        ${applicationDetails.coverLetter}
        
        Format this as a clear, professional email notification that includes all the applicant details and makes it easy to review the application.
      `

      const emailContent = await spark.llm(emailPrompt)

      // Create a structured email with all details
      const emailSubject = `New Application: ${applicationDetails.position} - ${applicationDetails.applicantName}`
      
      const emailBody = `
        ${emailContent}
        
        ---
        Application Details Summary:
        • Position: ${applicationDetails.position}
        • Applicant: ${applicationDetails.applicantName}
        • Email: ${applicationDetails.email}
        • Phone: ${applicationDetails.phone}
        • LinkedIn: ${applicationDetails.linkedinUrl}
        • Experience Level: ${applicationDetails.experience}
        • Resume File: ${applicationDetails.resumeFileName}
        • Submitted: ${applicationDetails.submissionDate}
        
        Cover Letter/Interest:
        ${applicationDetails.coverLetter}
        
        Note: The resume file was uploaded but cannot be automatically forwarded. Please follow up with the applicant to request the resume file directly.
      `

      // Create mailto link to open email client
      const mailto = `mailto:lyantovski@microsoft.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      
      // Open email client
      window.open(mailto, '_blank')

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Application submitted successfully! Email notification has been prepared for lyantovski@microsoft.com')
      onOpenChange(false)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        experience: '',
        coverLetter: '',
        resumeFile: null
      })
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
      console.error('Application submission error:', error)
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
            Submit your application for the Cloud Solution Architect position at Microsoft. 
            All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience">Years of Cloud Experience</Label>
                <Select onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="7-10">7-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter / Why are you interested?</Label>
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

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Upload *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {formData.resumeFile ? formData.resumeFile.name : 'Upload your resume'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or DOC files only, max 5MB
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Upload className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}