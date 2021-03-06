require 'fileutils'

module Jekyll
  class StatsFile < StaticFile
    def write(dest)
      target = File.join(dest, @dir, @name)
      FileUtils.copy_file(
        File.join(dest, "/../_temp/stats/#{@name}"),
        target
      )
      puts "#{target} created (#{File.size(target)} bytes)"
      true
    end
  end
  class WordCountBlock < Liquid::Tag
    def render(context)
      words = 0
      context['site'].posts.each do |doc|
        words += doc.content.split(/\s+/).length
      end
      count = words.to_s.reverse.gsub(/...(?=.)/,'\&,').reverse
      puts "#{count} words in the entire blog"
      count
    end
  end
  class StatsGenerator < Generator
    priority :low
    safe true
    def generate(site)
      dat = File.join(site.config['source'], '_temp/stats/stats.dat')
      FileUtils.mkdir_p File.dirname(dat)
      months = {}
      min = Time.parse('2014-04-01')
      site.posts.docs.each do |doc|
        next if doc.date < min
        m = doc.date.strftime("%Y-%m")
        months[m] = 0 if !months.key?(m)
        months[m] += doc.content.split(/\s+/).length
      end
      open(dat, 'w') do |f|
        for m, c in months
          f.puts "#{m}-01T00:00 #{c}"
        end
      end
      puts %x[
        set -e
        src=#{site.config['source']}
        tmp=#{File.dirname(dat)}
        cp ${src}/_stats/stats.gpi ${tmp}/stats.gpi
        cd ${tmp}
        gnuplot stats.gpi
        mkdir -p ${src}/_site
        cp ${tmp}/stats.svg ${src}/_site/stats.svg
      ]
      raise 'failed to build gnuplot stats image' if !$?.exitstatus
      site.static_files << Jekyll::StatsFile.new(site, site.dest, '', 'stats.svg')
    end
  end
end

Liquid::Template.register_tag('wordcount', Jekyll::WordCountBlock)
