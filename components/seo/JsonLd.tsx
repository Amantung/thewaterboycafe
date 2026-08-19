/**
 * Renders a JSON-LD graph into the document.
 *
 * Server component, so the markup is present in the initial HTML — crawlers
 * that do not execute JavaScript still see the structured data.
 *
 * On escaping: JSON.stringify can emit `</script>` inside a string value and
 * close the tag early, which is both a rendering bug and an XSS vector. All
 * content here is authored by us, but the escape is cheap insurance and the
 * habit is the right one.
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  const json = JSON.stringify(data).replace(/</g, '\u003c')

  return (
    <script
      id={id}
      type="application/ld+json"
      // Required: this is how structured data is embedded. The value is
      // serialised JSON from our own modules, escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
