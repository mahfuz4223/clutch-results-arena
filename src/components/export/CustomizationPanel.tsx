
import React from "react";
import { CustomizationOptions } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { THEME_OPTIONS, BACKGROUND_OPTIONS, CSS_PRESETS } from "@/utils/themes";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, Image, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (newOptions: Partial<CustomizationOptions>) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  options,
  onChange
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({ logoUrl: reader.result });
          toast.success("Logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Set custom background
          onChange({ 
            background: "custom",
            customBackgroundUrl: reader.result 
          });
          toast.success("Background uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading background:", error);
      toast.error("Failed to upload background. Please try again.");
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customization Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-3">
              <Label>Format Type</Label>
              <RadioGroup 
                value={options.theme === "pubg-official" ? "official" : "custom"} 
                onValueChange={(value) => {
                  if (value === "official") {
                    onChange({
                      theme: "pubg-official",
                      background: "dark-grid",
                      showGridLines: true,
                      showTencentLogo: true,
                      showPubgLogo: true,
                      showTournamentLogo: true,
                      showSponsors: true,
                      cssPreset: "official"
                    });
                  }
                }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="official" id="official" />
                  <Label htmlFor="official" className="flex items-center gap-2">
                    Official PUBG Style
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Recommended</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom Style</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Theme</Label>
              <Select 
                value={options.theme} 
                onValueChange={(value) => onChange({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Background Image</Label>
              <Select 
                value={options.background} 
                onValueChange={(value) => onChange({ background: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Background" />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_OPTIONS.map(bg => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {bg.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Background</SelectItem>
                </SelectContent>
              </Select>
              
              {options.background === "custom" && (
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('background-upload')?.click()}
                      className="w-full flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Background Image
                    </Button>
                    <input
                      id="background-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundUpload}
                    />
                  </div>
                  {options.customBackgroundUrl && (
                    <div className="mt-2">
                      <img 
                        src={options.customBackgroundUrl} 
                        alt="Custom background" 
                        className="h-20 w-full object-cover rounded-md border" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-3">
              <Label>Visual Options</Label>
              
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showGridLines" className="cursor-pointer">Show Grid Lines</Label>
                <Switch 
                  id="showGridLines" 
                  checked={options.showGridLines}
                  onCheckedChange={(checked) => onChange({ showGridLines: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showTencentLogo" className="cursor-pointer">Show Krafton/Tencent Logo</Label>
                <Switch 
                  id="showTencentLogo" 
                  checked={options.showTencentLogo}
                  onCheckedChange={(checked) => onChange({ showTencentLogo: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showPubgLogo" className="cursor-pointer">Show PUBG Logo</Label>
                <Switch 
                  id="showPubgLogo" 
                  checked={options.showPubgLogo}
                  onCheckedChange={(checked) => onChange({ showPubgLogo: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showTournamentLogo" className="cursor-pointer">Show Tournament Logo</Label>
                <Switch 
                  id="showTournamentLogo" 
                  checked={options.showTournamentLogo}
                  onCheckedChange={(checked) => onChange({ showTournamentLogo: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showSponsors" className="cursor-pointer">Show Sponsors</Label>
                <Switch 
                  id="showSponsors" 
                  checked={options.showSponsors}
                  onCheckedChange={(checked) => onChange({ showSponsors: checked })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-6">
            <div className="space-y-3">
              <Label>Footer Text</Label>
              <Input 
                value={options.footerText || "© 2025 TournaNext"} 
                onChange={(e) => onChange({ footerText: e.target.value })}
                placeholder="© 2025 Your Tournament Name"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Custom Logo</Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="w-full flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Upload Logo
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </div>
              
              {options.logoUrl && (
                <div className="mt-2 p-2 border rounded-md">
                  <img 
                    src={options.logoUrl} 
                    alt="Custom logo" 
                    className="h-12 mx-auto object-contain" 
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => onChange({ logoUrl: "" })}
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-3">
              <Label>CSS Style Presets</Label>
              <Select 
                value={options.cssPreset || "none"} 
                onValueChange={(value) => onChange({ cssPreset: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CSS Preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Custom CSS)</SelectItem>
                  {CSS_PRESETS.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Custom CSS</Label>
              <Textarea 
                placeholder="Enter custom CSS here"
                className="font-mono text-xs h-32"
                value={options.customCss || ""}
                disabled={options.cssPreset !== "none" && !!options.cssPreset}
                onChange={(e) => onChange({ customCss: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {options.cssPreset && options.cssPreset !== "none" 
                  ? "Select 'None' in the CSS Preset dropdown to enable custom CSS" 
                  : "Enter custom CSS to style the result card. Classes like .result-card, .header-title, etc. are available."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomizationPanel;
