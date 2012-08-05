require 'less'
require "yui/compressor"

LESS = File.join(SOURCE, "assets", "themes", "the-program") # set theme here
CONFIG['less'] = File.join(LESS, "css")
CONFIG['css'] = File.join(LESS, "css")
CONFIG['input'] = "style.less"
CONFIG['output'] = "style.css"

desc "Compile Less"
task :lessc do
  less   = CONFIG['less']

  input  = File.join( less, CONFIG['input'] )
  output = File.join( CONFIG['css'], CONFIG['output'] )

  source = File.open( input, "r" ).read
  parser = Less::Parser.new( :paths => [less] )
  tree = parser.parse( source )
  
  compressor = YUI::CssCompressor.new
  File.open( output, "w+" ) do |f|
    f.puts compressor.compress(tree.to_css( :compress => true ))
  end
end # task :lessc