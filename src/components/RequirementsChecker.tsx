import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, AlertCircle, TrendUp } from '@phosphor-icons/react'

interface RequirementsCheckerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequirementsChecker({ open, onOpenChange }: RequirementsCheckerProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const requirements = [
    {
      category: "Education",
      items: [
        { id: "bachelor", text: "Bachelor's degree in Computer Science, Engineering, Business, or related field", required: true },
        { id: "master", text: "Master's degree (preferred)", required: false }
      ]
    },
    {
      category: "Experience",
      items: [
        { id: "cloud-exp", text: "7+ years of experience in cloud and hybrid infrastructure technologies", required: true },
        { id: "enterprise", text: "Experience with enterprise-scale application portfolios", required: true },
        { id: "architecture", text: "Cloud-native app hosting and design experience", required: true }
      ]
    },
    {
      category: "Azure Services",
      items: [
        { id: "azure-ai", text: "Azure AI Foundry experience", required: true },
        { id: "aks", text: "AKS (Azure Kubernetes Service) proficiency", required: true },
        { id: "app-service", text: "App Service knowledge", required: true },
        { id: "cosmos", text: "Azure Cosmos DB experience", required: true },
        { id: "sql", text: "Azure SQL Databases proficiency", required: true },
        { id: "postgres", text: "Azure Database for PostgreSQL", required: true },
        { id: "apim", text: "API Management (APIM) experience", required: true }
      ]
    },
    {
      category: "Development & DevOps",
      items: [
        { id: "github", text: "GitHub proficiency", required: true },
        { id: "devops", text: "DevOps skills and methodologies", required: true },
        { id: "ci-cd", text: "CI/CD pipeline experience", required: false }
      ]
    },
    {
      category: "Leadership & Communication",
      items: [
        { id: "communication", text: "Strong communication skills", required: true },
        { id: "virtual-teams", text: "Ability to lead virtual teams", required: true },
        { id: "stakeholder", text: "Experience influencing stakeholders", required: true },
        { id: "c-level", text: "C-suite interaction experience", required: false }
      ]
    },
    {
      category: "Certifications",
      items: [
        { id: "azure-cert", text: "Azure technical certifications", required: false },
        { id: "aws-cert", text: "AWS certifications", required: false },
        { id: "gcp-cert", text: "GCP certifications", required: false },
        { id: "security-cert", text: "Security domain certifications", required: false }
      ]
    }
  ]

  const handleItemChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: checked }))
  }

  // Calculate overall score
  const totalRequiredItems = requirements.flatMap(cat => cat.items.filter(item => item.required)).length
  const totalOptionalItems = requirements.flatMap(cat => cat.items.filter(item => !item.required)).length
  const checkedRequiredItems = requirements.flatMap(cat => cat.items.filter(item => item.required && checkedItems[item.id])).length
  const checkedOptionalItems = requirements.flatMap(cat => cat.items.filter(item => !item.required && checkedItems[item.id])).length

  const requiredScore = (checkedRequiredItems / totalRequiredItems) * 100
  const optionalScore = (checkedOptionalItems / totalOptionalItems) * 100
  const overallScore = (requiredScore * 0.8) + (optionalScore * 0.2)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getFeedback = (score: number) => {
    if (score >= 90) return "Excellent fit! You meet almost all requirements."
    if (score >= 80) return "Very good fit! You meet most requirements."
    if (score >= 70) return "Good fit! Consider strengthening a few areas."
    if (score >= 60) return "Decent fit, but focus on developing key skills."
    return "Consider gaining more experience before applying."
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Requirements Checker</DialogTitle>
          <DialogDescription>
            Check how well you match the requirements for the Cloud Solution Architect position.
            Be honest in your self-assessment for the most accurate results.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp className="h-5 w-5" />
                Your Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {getScoreIcon(overallScore)}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Match</span>
                    <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>
                      {Math.round(overallScore)}%
                    </span>
                  </div>
                  <Progress value={overallScore} className="h-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Required Skills</span>
                    <span className="text-xs font-medium">{checkedRequiredItems}/{totalRequiredItems}</span>
                  </div>
                  <Progress value={requiredScore} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Nice to Have</span>
                    <span className="text-xs font-medium">{checkedOptionalItems}/{totalOptionalItems}</span>
                  </div>
                  <Progress value={optionalScore} className="h-1" />
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Assessment:</p>
                <p className="text-sm text-muted-foreground">{getFeedback(overallScore)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Checklist */}
          <div className="space-y-4">
            {requirements.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3"
                      >
                        <Checkbox
                          id={item.id}
                          checked={checkedItems[item.id] || false}
                          onCheckedChange={(checked) => 
                            handleItemChange(item.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={item.id}
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            {item.text}
                          </label>
                          <div className="flex gap-2 mt-1">
                            <Badge 
                              variant={item.required ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {item.required ? "Required" : "Preferred"}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            {overallScore >= 70 && (
              <Button
                onClick={() => {
                  onOpenChange(false)
                  // This would trigger the application form
                  window.dispatchEvent(new CustomEvent('openApplicationForm'))
                }}
                className="flex-1"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}