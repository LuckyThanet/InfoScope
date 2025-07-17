import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Globe, Shield, History, Play } from "lucide-react";

const MainFeatureSection = () => {
  const [formData, setFormData] = useState({
    username: "",
    domain: "",
    password: ""
  });

  const [selectedTools, setSelectedTools] = useState({
    whois: false,
    whatmyname: false,
    haveibeenpwned: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToolChange = (tool: string, checked: boolean) => {
    setSelectedTools(prev => ({ ...prev, [tool]: checked }));
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Descriptions */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Intelligence Gathering Made Simple
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Enter the target information below and select the OSINT tools you want to utilize.
                Our platform will aggregate results from multiple sources to provide comprehensive intelligence.
              </p>
            </div>

            {/* Input Field Descriptions */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Search className="w-5 h-5 text-primary mr-2" />
                    Input Fields
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Username</h4>
                    <p className="text-sm text-muted-foreground">Target username or handle to investigate across platforms</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Domain Name</h4>
                    <p className="text-sm text-muted-foreground">Website or domain to perform reconnaissance on</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Password</h4>
                    <p className="text-sm text-muted-foreground">Check if credentials have been compromised in data breaches</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tool Descriptions */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="w-5 h-5 text-primary mr-2" />
                    Available OSINT Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground">WHOIS</h4>
                    <p className="text-sm text-muted-foreground">Retrieve domain registration information and ownership details</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">WhatMyName</h4>
                    <p className="text-sm text-muted-foreground">Search for usernames across hundreds of social media platforms</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Have I Been Pwned</h4>
                    <p className="text-sm text-muted-foreground">Check if accounts or passwords have been compromised in data breaches</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Input and Tools */}
          <div className="space-y-8">
            <Card className="border-border bg-card shadow-glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Globe className="w-6 h-6 text-primary mr-2" />
                  Investigation Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter target username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="mt-2 bg-muted/30 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain" className="text-foreground font-medium">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={formData.domain}
                      onChange={(e) => handleInputChange("domain", e.target.value)}
                      className="mt-2 bg-muted/30 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password to check"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="mt-2 bg-muted/30 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Tool Selection */}
                <div>
                  <Label className="text-foreground font-medium mb-3 block">Select OSINT Tools</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="whois"
                        checked={selectedTools.whois}
                        onCheckedChange={(checked) => handleToolChange("whois", checked as boolean)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="whois" className="text-foreground">WHOIS</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="whatmyname"
                        checked={selectedTools.whatmyname}
                        onCheckedChange={(checked) => handleToolChange("whatmyname", checked as boolean)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="whatmyname" className="text-foreground">WhatMyName</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="haveibeenpwned"
                        checked={selectedTools.haveibeenpwned}
                        onCheckedChange={(checked) => handleToolChange("haveibeenpwned", checked as boolean)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="haveibeenpwned" className="text-foreground">Have I Been Pwned</Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    className="flex-1 bg-gradient-cyber hover:shadow-glow-primary transition-all duration-300"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Investigation
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    size="lg"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFeatureSection;