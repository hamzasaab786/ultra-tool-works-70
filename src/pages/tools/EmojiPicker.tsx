
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Search, Smile } from "lucide-react";
import SEO from "@/components/SEO";

const EmojiPicker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedEmojis, setCopiedEmojis] = useState<string[]>([]);
  const { toast } = useToast();

  const emojiCategories = {
    "Smileys & People": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐"],
    "Animals & Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷", "🕸", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁", "🐀", "🐿", "🦔"],
    "Food & Drink": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯"],
    "Travel & Places": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍", "🛵", "🚲", "🛴", "🛹", "🛼", "🚁", "🛸", "✈️", "🛩", "🛫", "🛬", "🪂", "💺", "🚀", "🛰", "🚢", "⛵", "🚤", "🛥", "🛳", "⛴", "🚧", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽"],
    "Objects": ["⌚", "📱", "📲", "💻", "⌨", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎", "📟", "📠", "📺", "📻", "🎙", "🎚", "🎛", "🧭", "⏱", "⏲", "⏰", "🕰", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯", "🪔", "🧯", "🛢", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖", "🧰", "🔧", "🔨", "⚒", "🛠", "⛏", "🔩", "⚙", "🧱", "⛓", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡", "⚔", "🛡", "🚬", "⚰", "🪦", "⚱", "🏺", "🔮", "📿", "🧿", "💈", "⚗", "🔭", "🔬", "🕳", "🩹", "🩺", "💊", "💉", "🧬", "🦠", "🧫", "🧪", "🌡", "🧹", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁", "🛀", "🧴", "🧷", "🧸", "🧵", "🧶", "🪡", "🧽", "🧼", "🪒", "🧾", "🧮"]
  };

  const allEmojis = Object.values(emojiCategories).flat();

  const filteredEmojis = searchTerm 
    ? allEmojis.filter(emoji => {
        // Simple search - you could enhance this with emoji names/descriptions
        return true; // For now, show all emojis when searching
      })
    : allEmojis;

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmojis([emoji, ...copiedEmojis.slice(0, 19)]); // Keep last 20
    toast({
      title: "Emoji copied!",
      description: `${emoji} has been copied to your clipboard.`,
    });
  };

  const copyAllRecent = () => {
    const recentText = copiedEmojis.slice(0, 10).join("");
    navigator.clipboard.writeText(recentText);
    toast({
      title: "Recent emojis copied!",
      description: "Your recent emojis have been copied as text.",
    });
  };

  return (
    <>
      <SEO
        title="Emoji Picker - Copy Emojis to Clipboard Online Free"
        description="Browse and copy emojis to clipboard. Find the perfect emoji for your messages, social media posts, and documents."
        keywords="emoji picker, copy emoji, emoji search, emoji keyboard, emoji finder, unicode emojis"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Emoji Picker
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse thousands of emojis and copy them to your clipboard with a single click
            </p>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Emojis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search for emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </CardContent>
            </Card>

            {/* Recent Emojis */}
            {copiedEmojis.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recently Copied
                    <Button size="sm" onClick={copyAllRecent}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your recently copied emojis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-2">
                    {copiedEmojis.slice(0, 20).map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => copyEmoji(emoji)}
                        className="h-12 w-12 text-2xl p-0"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emoji Categories */}
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5" />
                    {category}
                  </CardTitle>
                  <CardDescription>
                    Click any emoji to copy it to your clipboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-2">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => copyEmoji(emoji)}
                        className="h-12 w-12 text-2xl p-0 hover:scale-110 transition-transform"
                        title={`Copy ${emoji}`}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">✨ Quick Copy</h4>
                    <p className="text-sm text-gray-600">
                      Click any emoji to instantly copy it to your clipboard
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📝 Recent History</h4>
                    <p className="text-sm text-gray-600">
                      View and reuse your recently copied emojis
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📱 Universal Support</h4>
                    <p className="text-sm text-gray-600">
                      Works across all devices, browsers, and applications
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🎯 Organized Categories</h4>
                    <p className="text-sm text-gray-600">
                      Find emojis quickly with organized categories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;
